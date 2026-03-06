using System.ComponentModel.DataAnnotations.Schema;
using ResearchManager.API.Models;
namespace ResearchManager.API.Models;
[Table("publicaciones_proy")]
public class PublicacionProy{
    [Column("idproyecto")]
    public int IdProyecto { get; set; }

    [Column("idart")]
    public int IdArt { get; set; }

    // Navigation properties
    public Proyecto? Proyecto { get; set; }
    public Publicacion? Publicacion { get; set; }
}