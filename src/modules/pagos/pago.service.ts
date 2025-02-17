import { injectable } from "inversify";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

@injectable()
export class PagoService {
  constructor() {}

  // Método para procesar el pago de una cita
  async pagarCita(monto: number, pacienteId: number): Promise<boolean> {
    try {
      // Crear un PaymentIntent con Stripe
      const pago = await stripe.paymentIntents.create({
        amount: monto * 100, // Stripe espera el monto en centavos
        currency: "usd",
        description: `Pago de cita para el paciente ${pacienteId}`,
        payment_method_types: ["card"],
      });

      // Lógica para verificar si el pago fue exitoso
      if (pago.status === "succeeded") {
        return true; // Pago exitoso
      }
      return false; // Si el pago no fue exitoso
    } catch (error) {
      throw new Error("Error procesando el pago");
    }
  }

  // Otro método que podrías tener, como obtener detalles de un pago
  async obtenerPago(pagoId: string): Promise<Stripe.PaymentIntent | null> {
    try {
      const pago = await stripe.paymentIntents.retrieve(pagoId);
      return pago;
    } catch (error) {
      throw new Error("Error obteniendo los detalles del pago");
    }
  }
}
