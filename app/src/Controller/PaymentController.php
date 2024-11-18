<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Stripe\Stripe;
use Stripe\Exception\ApiErrorException;

class PaymentController extends AbstractController
{
    #[Route('/stripe', name: 'app_stripe')]
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to your stripe controller!',
        ]);
    }

    #[Route('/payment/paymentIntent')]
    public function createPaymentIntent(Request $request): JsonResponse
    {
        $requestData = explode("=", $request->getContent());

        try {
            Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

            // Créer le PaymentIntent avec le montant et la devise
            $paymentIntent = \Stripe\PaymentIntent::create([
                'amount' => intval($requestData[1]),
                'currency' => 'eur',
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);

            // Retourner le clientSecret généré
            return new JsonResponse(['clientSecret' => $paymentIntent->client_secret]);
        } catch (ApiErrorException $e) {
            // Gérer les erreurs Stripe
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    private function calculateOrderAmount(array $items): int
    {
        $result = 0;
        for ($i = 0; $i < count($items); $i++) {
            $result += $items[$i]['price'];
        }
        return $result;
    }
}