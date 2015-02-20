<?php

class CandidatesController extends Controller {

  public function stack($parameters) {
    $query = $this->em->createQueryBuilder()
      ->select('c')
      ->from('Candidate', 'c')
      ->where('c.province = ?1')
      ->setParameter(1, $parameters['province'])
      ->getQuery();

    $candidates = $query->getResult();

    shuffle($candidates);
    return array_map(function ($candidate) {
      return array(
        'id'        => $candidate->getId(),
        'name'      => $candidate->getName(),
        'image_url' => $candidate->getImageUrl()
      );
    }, $candidates);
  }

}