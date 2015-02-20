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
    $parties = array();

    shuffle($candidates);

    $data = array(
      'candidates' => array(),
      'parties'    => array()
    );

    foreach ($candidates as $candidate) {
      $party = $candidate->getParty();
      $parties[$party->getId()] = $party;

      $data['candidates'][] = array(
        'id'        => $candidate->getId(),
        'name'      => $candidate->getName(),
        'party_id'  => $party->getId(),
        'image_url' => $candidate->getImageUrl()
      );
    }

    foreach ($parties as $id => $party) {
      $data['parties'][] = array(
        'id'        => $party->getId(),
        'name'      => $party->getLongName(),
        'logo_url'  => $party->getLogoUrl()
      );
    }

    return $data;
  }

}