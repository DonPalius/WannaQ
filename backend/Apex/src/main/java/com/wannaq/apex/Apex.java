package com.wannaq.apex;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.util.Map;

@Entity
@Table
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Apex {
    @Id
    private String id;
    private String gameNickname;
    private Long rating;
    private String rank;
    private Long wins;
    private Long kills;

    private ZonedDateTime timestamp;


}
