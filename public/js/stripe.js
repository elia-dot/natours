import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51JASCJJXcyhdzAo6t2Kx5NMtp9NhZ9E8Bb4I4d9q6GgWDtimb838mTDQImw22WG4yaXJ1ph3QFSDsLYKZ8ojmasG00ywdNg7aa'
    );
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
