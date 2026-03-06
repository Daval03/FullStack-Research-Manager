// Models/Investigador.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchManager.API.Models;
// Mapea exactamente al nombre de la tabla en Postgres o la db que usemos
[Table("investigadores")]  
public class Investigador
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("nombre_completo")]
    [StringLength(200)]
    public string? NombreCompleto { get; set; }

    [Column("titulo_academico")]
    [StringLength(50)]
    public string? TituloAcademico { get; set; }

    [Column("institucion")]
    [StringLength(50)]
    public string? Institucion { get; set; }

    [Column("email")]
    [StringLength(100)]
    public string? Email { get; set; }
}