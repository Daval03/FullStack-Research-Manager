using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchManager.API.Models;

[Table("proyectos")]
public class Proyecto
{
    [Key]
    [Column("idpry")]
    public int IdPry { get; set; }

    [Column("titulo_proyecto")]
    [StringLength(200)]
    public string? TituloProyecto { get; set; }

    [Column("anno_inicio")]
    public int? AnnoInicio { get; set; }

    [Column("duracion_meses")]
    public int? DuracionMeses { get; set; }

    [Column("area_conocimiento")]
    [StringLength(100)]
    public string? AreaConocimiento { get; set; }
}