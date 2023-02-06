package com.wannaq.league;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeagueRepository extends JpaRepository<League, String> {
    Optional<League> findByAccountId(String accountId);

    List<League> findAllByIdNot(String id);

    Optional<League> findBySummonernameIgnoreCase(String gameNickname);

    boolean existsBySummonernameIgnoreCase(String nickName);

}
