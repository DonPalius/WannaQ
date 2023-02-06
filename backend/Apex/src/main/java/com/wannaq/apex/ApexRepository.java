package com.wannaq.apex;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApexRepository extends JpaRepository<Apex, String> {

    List<Apex> findAllByIdNot(String id);

    Optional<Apex> findByGameNickname(String nickName);

    boolean existsByGameNicknameIgnoreCase(String nickName);

    Optional<Apex> findByGameNicknameIgnoreCase(String apexNickName);



}
