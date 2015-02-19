<?php

class VotesController extends Controller {

  function create($parameters) {
    $vote = new Vote();
    $vote->setCandidateId($parameters['candidate_id']);
    $vote->setVote($parameters['vote']);

    $this->em->persist($vote);
    $this->em->flush();

    return ['status' => 'ok'];
  }

}