# agent/derivacion.py — Pasar una conversacion a una persona del equipo
# Generado por AgentKit para Cargonam

"""
Cuando Cargo no puede resolver algo, termina su mensaje con la marca [[DERIVAR]].
Este modulo:
  1. quita la marca antes de que el mensaje le llegue al cliente,
  2. pausa al bot en esa conversacion (para que no se pise con el asesor),
  3. avisa al equipo.

El aviso siempre queda en el log. Si se configura SMTP en el .env, ademas llega un correo.
La conversacion completa se ve y se contesta desde la bandeja de entrada de Zernio.
"""

import asyncio
import logging
import os
import smtplib
from email.message import EmailMessage

logger = logging.getLogger("agentkit")

MARCA = "[[DERIVAR]]"
HORAS_PAUSA = float(os.getenv("HANDOFF_HORAS") or "12")


def separar_marca(respuesta: str) -> tuple[str, bool]:
    """Retorna (texto_para_el_cliente, hay_que_derivar)."""
    if MARCA not in respuesta:
        return respuesta, False
    limpio = respuesta.replace(MARCA, "").strip()
    return limpio, True


def _armar_resumen(telefono: str, historial: list[dict], ultimo_mensaje: str) -> str:
    lineas = [f"Cliente: {telefono}", "", "Ultimos mensajes:"]
    for m in historial[-8:]:
        quien = "Cliente" if m["role"] == "user" else "Cargo"
        lineas.append(f"  {quien}: {m['content']}")
    lineas.append(f"  Cliente: {ultimo_mensaje}")
    lineas += ["", "Respondele desde la bandeja de entrada de Zernio.",
               f"El bot queda en pausa en este chat durante {HORAS_PAUSA:g} horas."]
    return "\n".join(lineas)


def _enviar_correo(asunto: str, cuerpo: str) -> None:
    """Envio SMTP sincrono; se llama en un hilo para no bloquear el servidor."""
    msg = EmailMessage()
    msg["Subject"] = asunto
    msg["From"] = os.getenv("SMTP_FROM") or os.getenv("SMTP_USER", "")
    msg["To"] = os.getenv("AVISO_EMAIL", "")
    msg.set_content(cuerpo)

    host = os.getenv("SMTP_HOST", "")
    puerto = int(os.getenv("SMTP_PORT") or "587")
    with smtplib.SMTP(host, puerto, timeout=20) as smtp:
        smtp.starttls()
        smtp.login(os.getenv("SMTP_USER", ""), os.getenv("SMTP_PASSWORD", ""))
        smtp.send_message(msg)


async def avisar_al_equipo(telefono: str, historial: list[dict], ultimo_mensaje: str) -> None:
    """Avisa que un cliente necesita a una persona. Nunca lanza excepciones."""
    resumen = _armar_resumen(telefono, historial, ultimo_mensaje)
    logger.warning(f"DERIVACION a customer service:\n{resumen}")

    if not (os.getenv("AVISO_EMAIL") and os.getenv("SMTP_HOST")):
        return  # sin correo configurado: el aviso queda solo en el log y en Zernio

    try:
        await asyncio.to_thread(
            _enviar_correo, f"Cargonam: el cliente {telefono} necesita un asesor", resumen
        )
        logger.info(f"Aviso de derivacion enviado a {os.getenv('AVISO_EMAIL')}")
    except Exception as e:  # noqa: BLE001
        logger.error(f"No se pudo enviar el correo de derivacion: {e}")
