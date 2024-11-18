<?php

namespace App\Entity;

use App\Repository\OrdersRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OrdersRepository::class)]
class Orders
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private ?string $total_price = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $creation_date = null;

    #[ORM\Column(type: 'boolean')]
    private ?bool $is_buy = false;


    #[ORM\ManyToOne(inversedBy: 'orders')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Users $email = null;

    /**
     * @var Collection<int, ToOrder>
     */
    #[ORM\OneToMany(targetEntity: ToOrder::class, mappedBy: 'idOrders')]
    private Collection $toOrders;

    public function __construct()
    {
        $this->toOrders = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTotalPrice(): ?string
    {
        return $this->total_price;
    }

    public function setTotalPrice(string $total_price): static
    {
        $this->total_price = $total_price;

        return $this;
    }

    public function getCreationDate(): ?\DateTimeInterface
    {
        return $this->creation_date;
    }

    public function setCreationDate(\DateTimeInterface $creation_date): static
    {
        $this->creation_date = $creation_date;

        return $this;
    }

    public function getEmail(): ?Users
    {
        return $this->email;
    }

    public function setEmail(?Users $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getIsBuy(): ?bool
    {
        return $this->is_buy;
    }

    public function setIsBuy(?bool $is_buy): static
    {
    $this->is_buy = $is_buy;

    return $this;
}

    /**
     * @return Collection<int, ToOrder>
     */
    public function getToOrders(): Collection
    {
        return $this->toOrders;
    }

    public function addToOrder(ToOrder $toOrder): static
    {
        if (!$this->toOrders->contains($toOrder)) {
            $this->toOrders->add($toOrder);
            $toOrder->setIdOrders($this);
        }

        return $this;
    }

    public function removeToOrder(ToOrder $toOrder): static
    {
        if ($this->toOrders->removeElement($toOrder)) {
            // set the owning side to null (unless already changed)
            if ($toOrder->getIdOrders() === $this) {
                $toOrder->setIdOrders(null);
            }
        }

        return $this;
    }
}
