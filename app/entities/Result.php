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
   * @Column(name="remote_ip", type="string")
   */
  private $remoteIp;

  /**
   * @Column(name="province", type="string")
   */
  private $province;

  /**
   * @ManyToOne(targetEntity="Party")
   * @JoinColumn(name="winning_party_id", referencedColumnName="id")
   */
  private $winningParty;

  /**
   * @OneToMany(targetEntity="Vote", mappedBy="result")
   */
  private $votes;

  /**
   * @Column(name="created_at", type="datetime", nullable=true)
   */
  private $createdAt;

  public function __construct() {
    $this->createdAt = date_create();
  }

  public function getId() {
    return $this->id;
  }

  public function getRemoteIp() {
    return $this->remoteIp;
  }
  public function setRemoteIp($value) {
    $this->remoteIp = $value;
    return $this;
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

  public function getCreatedAt() {
    return $this->createdAt;
  }
  public function setCreatedAt($value) {
    $this->createdAt = $value;
  }

}
