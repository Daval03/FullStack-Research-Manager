using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchManager.API.Models;

[Table("publicaciones")]
public class Publicacion
{
    [Key]
    [Column("idpub")]
    public int IdPub { get; set; }

    [Column("titulo_publicacion")]
    [StringLength(300)]
    public string? TituloPublicacion { get; set; }

    [Column("anno_publicacion")]
    public int? AnnoPublicacion{ get; set; }

    [Column("nombre_revista")]
    [StringLength(200)]
    public string? NombreRevista { get; set; }
}