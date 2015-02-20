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
   * @ManyToOne(targetEntity="Result", inversedBy="votes")
   * @JoinColumn(name="result_id", referencedColumnName="id")
   */
  private $result;

  /**
   * @ManyToOne(targetEntity="Candidate", inversedBy="votes")
   * @JoinColumn(name="candidate_id", referencedColumnName="id")
   */
  private $candidate;

  /**
   * @Column(name="vote", type="string", length=4)
   */
  private $vote;

  public function getId() {
    return $this->id;
  }

  public function getResult() {
    return $this->result;
  }
  public function setResult($value) {
    $this->result = $value;
    return $this;
  }

  public function getCandidate() {
    return $this->candidate;
  }
  public function setCandidate($value) {
    $this->candidate = $value;
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