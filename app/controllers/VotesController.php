<?php

class VotesController extends Controller {

  function create($parameters) {
    $candidate = $this->em->find('Candidate', $parameters['candidate_id']);

    $vote = new Vote();
    $vote->setCandidate($candidate);
    $vote->setVote($parameters['vote']);

    $this->em->persist($vote);
    $this->em->flush();

    return array('status' => 'ok');
  }

}