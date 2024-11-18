<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Orders;
use App\Entity\Catalogs;
use App\Entity\Users;
use App\Entity\ToOrder;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class OrdersController extends AbstractController
{
    #[Route('/orders', name: 'api_get_orders', methods: ['GET'])]
    #[IsGranted("ROLE_USER")]
    public function getOrders(ManagerRegistry $doctrine): JsonResponse
    {
        // Récupérer l'utilisateur actuel
        /** @var Users $currentUser */
        $currentUser = $this->getUser();

        $currentEmail = $currentUser->getEmail();

        $orders = $doctrine->getRepository(Orders::class)->findBy(['email' => $currentEmail]);


        $ordersData = [];
        foreach ($orders as $order) {
            $orderData = [
                'id' => $order->getId(),
                'totalPrice' => $order->getTotalPrice(),
                'creationDate' => $order->getCreationDate()->format('Y-m-d H:i:s'),
                'products' => [],
            ];

            foreach ($order->getToOrders() as $toOrder) {
                $catalog = $toOrder->getIdCatalogs();
                $productData = [
                    'id' => $catalog->getId(),
                    'name' => $catalog->getName(),
                    'description' => $catalog->getDescription(),
                    'photo' => $catalog->getPhoto(),
                    'price' => $catalog->getPrice(),
                    'brand' => $catalog->getBrand(),
                    'resolution' => $catalog->getResolution(),
                    'size' => $catalog->getSize(),
                    'technology' => $catalog->getTechnology(),
                    'connectivity' => $catalog->getConnectivity(),
                    'isSmartTV' => $catalog->isSmartTV(),
                ];
                $orderData['products'][] = $productData;
            }

            $ordersData[] = $orderData;
        }

        return $this->json($ordersData);
    }

    #[Route('/orders/{orderId}', name: 'get_order', methods: ['GET'])]
    #[IsGranted("ROLE_USER")]
    public function getOrder($orderId): JsonResponse
    {        
        $order = [
            'orderId' => $orderId,
            'customer' => 'John Doe',
            'totalPrice' => 150.00,
        ];

        return $this->json($order);
    }

    //Delete
    #[Route('/api/orders/{orderId}', methods: ['DELETE'])]
    public function deleteOrder(EntityManagerInterface $entityManager, int $orderId): JsonResponse
    {
        $order = $entityManager->getRepository(Orders::class)->find($orderId);

        if (!$order) {
            return new JsonResponse(['error' => 'Order not found'], 404);
        }

        $entityManager->remove($order);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Order deleted']);
    }

    //Add Product To Cart
    #[Route('/carts/{productId}', methods: ['POST'])]
    public function addToCart(EntityManagerInterface $entityManager, int $productId): JsonResponse
    {
        $product = $entityManager->getRepository(Catalogs::class)->find($productId);

        if (!$product) {
            return $this->json([
                'error' => 'Product not found',
            ], 404);
        }

        $user = $this->getUser();

        $toOrder = new ToOrder();
        $toOrder->setIdCatalogs($product);
        $toOrder->setIdOrders($user);

        $entityManager->persist($toOrder);
        $entityManager->flush();

        return $this->json([
            'message' => 'Product added to cart!',
        ]);
    }

    //Remove Product from Cart
    #[Route('/carts/{productId}', methods: ['DELETE'])]
    public function removeFromCart(EntityManagerInterface $entityManager, int $productId): JsonResponse
    {
        $product = $entityManager->getRepository(Catalogs::class)->find($productId);

        if (!$product) {
            return $this->json([
                'error' => 'Product not found',
            ], 404);
        }

        $user = $this->getUser();

        $toOrder = $entityManager->getRepository(ToOrder::class)->findOneBy([
            'idCatalogs' => $product,
            'idOrders' => $user,
        ]);

        if (!$toOrder) {
            return $this->json([
                'error' => 'Product not found in the cart',
            ], 404);
        }

        $entityManager->remove($toOrder);
        $entityManager->flush();

        return $this->json([
            'message' => 'Product removed from cart!',
        ]);
    }

    //Display Product From Cart
    #[Route('/cart', methods: ['GET'])]
    public function viewCart(ManagerRegistry $doctrine): JsonResponse
    {
        $user = $this->getUser();

        $toOrders = $doctrine->getRepository(ToOrder::class)->findBy(['idOrders' => $user]);

        if (empty($toOrders)) {
            return $this->json([
                'message' => 'Cart is empty',
                'items' => [],
            ]);
        }

        $items = [];
        foreach ($toOrders as $toOrder) {
            $product = $toOrder->getIdCatalogs(); 
            $items[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'description' => $product->getDescription(),
                'photo' => $product->getPhoto(),
                'price' => $product->getPrice(),
                'brand' => $product->getBrand(),
                'resolution' => $product->getResolution(),
                'size' => $product->getSize(),
                'technology' => $product->getTechnology(),
                'connectivity' => $product->getConnectivity(),
                'isSmartTV' => $product->isSmartTV(),
            ];
        }

        return $this->json([
            'message' => 'Cart items retrieved successfully',
            'items' => $items,
        ]);
    }

    #[Route('/cart', methods: ['POST'])]
    #[IsGranted("ROLE_USER")]
    public function createCart(EntityManagerInterface $entityManager): JsonResponse
    {
        $cart = new Orders();
        $cart->setIsBuy(false);
        $cart->setCreationDate(new \DateTime());  

        $entityManager->persist($cart);
        $entityManager->flush();

        return $this->json([
            'message' => 'Cart created successfully!',
            'cartId' => $cart->getId(),
        ]);
    }
}