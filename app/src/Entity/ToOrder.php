<?php

namespace App\Entity;

use App\Repository\ToOrderRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ToOrderRepository::class)]
class ToOrder
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'toOrders')]
    private ?Catalogs $idCatalogs = null;

    #[ORM\ManyToOne(inversedBy: 'toOrders')]
    private ?Orders $idOrders = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdCatalogs(): ?Catalogs
    {
        return $this->idCatalogs;
    }

    public function setIdCatalogs(?Catalogs $idCatalogs): static
    {
        $this->idCatalogs = $idCatalogs;

        return $this;
    }

    public function getIdOrders(): ?Orders
    {
        return $this->idOrders;
    }

    public function setIdOrders(?Orders $idOrders): static
    {
        $this->idOrders = $idOrders;

        return $this;
    }
}
