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

}