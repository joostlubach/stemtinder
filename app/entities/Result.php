<?php

/**
 * @Entity @Table(name="results")
 */
class Result {

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
   * @ManyToOne(targetEntity="party")
   * @JoinColumn(name="winning_party_id", referencedColumnName="id")
   */
  private $winningParty;

  /**
   * @OneToMany(targetEntity="Vote", mappedBy="result")
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

  public function getWinningParty() {
    return $this->winningParty;
  }
  public function setWinningParty($value) {
    $this->winningParty = $value;
    return $this;
  }

}
