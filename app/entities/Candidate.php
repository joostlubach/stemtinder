<?php

/**
 * @Entity
 * @Table(
 *   name="candidates",
 *   indexes={@Index(name="province_idx", columns={"province"})}
 * )
 */
class Candidate {

  /**
   * @Column(name="id", type="integer")
   * @Id @GeneratedValue
   */
  private $id;

  /**
   * @Column(name="province", type="string")
   */
  private $province;

  /**
   * @ManyToOne(targetEntity="party", inversedBy="candidates")
   * @JoinColumn(name="party_id", referencedColumnName="id")
   */
  private $party;

  /**
   * @Column(name="name", type="string")
   */
  private $name;

  /**
   * @Column(name="imageUrl", type="string")
   */
  private $imageUrl;

  /**
   * @OneToMany(targetEntity="Vote", mappedBy="candidate")
   */
  private $votes;

  public function getId() {
    return $this->id;
  }

  public function getProvince() {
    return $this->province;
  }
  public function setProvince($value) {
    $this->province = $value;
    return $this;
  }

  public function getParty() {
    return $this->party;
  }
  public function setParty($value) {
    $this->party = $value;
    return $this;
  }

  public function getName() {
    return $this->name;
  }
  public function setName($value) {
    $this->name = $value;
    return $this;
  }

  public function getImageUrl() {
    return $this->imageUrl;
  }
  public function setImageUrl($value) {
    $this->imageUrl = $value;
    return $this;
  }

}