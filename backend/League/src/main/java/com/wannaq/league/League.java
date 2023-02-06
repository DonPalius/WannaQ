package com.wannaq.league;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;

@Entity
@Table
@AllArgsConstructor
@NoArgsConstructor
@Data
public class League {
    @Id
    private String id;

    private String summonername;
    private String summonerId;
    private String accountId;
    private String puuid;
    private Long summonerLevel;
    private String ranksoloq;
    private Long pointsoloq;
    private String rankflex;
    private Long pointflex;
    private Long winssoloq;
    private Long winsflex;
    private Long lossesoloq;
    private Long lossflex;

    private ZonedDateTime timestamp;

}
