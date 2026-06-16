package com.productivity.backend.analytics;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({"status_produktivitas", "kesimpulan", "daftar_saran"})
public record ProductivityInsightResponse(
        @JsonProperty("status_produktivitas") String statusProduktivitas,
        @JsonProperty("kesimpulan") String kesimpulan,
        @JsonProperty("daftar_saran") List<String> daftarSaran
) {
}