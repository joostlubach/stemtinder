<?php

/**
 * @Entity @Table(name="votes")
 */
class Vote {

  /**
   * @Column(name="id", type="integer")
   * @Id @GeneratedValue
   */
  private $id;

  /**
   * @Column(name="candidate_id", type="integer")
   */
  private $candidateId;

  /**
   * @Column(name="vote", type="string", length=4)
   */
  private $vote;

  public function getId() {
    return $this->id;
  }

  public function getCandidateId() {
    return $this->candidateId;
  }
  public function setCandidateId($value) {
    $this->candidateId = $value;
    return $this;
  }

  public function getVote() {
    return $this->vote;
  }
  public function setVote($value) {
    $this->vote = $value;
    return $this;
  }

}