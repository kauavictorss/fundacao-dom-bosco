package dom.bosco.api.estoque;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "movimentacoes_estoque")
public class MovimentacaoEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "item_id")
    private Long itemId;

    @NotNull
    @Column(name = "tipo_movimento")
    @Enumerated(EnumType.STRING)
    private TipoMovimentacao tipoMovimento;

    @NotNull
    @Positive
    private Integer quantidade;

    @Column(name = "valor_total")
    private BigDecimal valorTotal;

    @NotNull
    private String motivo;

    @Column(name = "notas_compra", columnDefinition = "TEXT")
    private String notasCompra;

    @Column(name = "comprovante_arquivo", columnDefinition = "TEXT")
    private String comprovanteArquivo;

    @Column(name = "usuario_id")
    private Long usuarioId;

    @Column(name = "data_movimento")
    private LocalDateTime dataMovimento;

    @PrePersist
    protected void onCreate() {
        if (dataMovimento == null) {
            dataMovimento = LocalDateTime.now();
        }
    }


}
