using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchManager.API.Models;

[Table("investigadores_proy")]
public class InvestigadorProy
{
    [Column("idinv")]
    public int IdInv { get; set; }

    [Column("idproy")]
    public int IdProy { get; set; }

    // Navegación (EF los une automáticamente)
    public Investigador? Investigador { get; set; }
    public Proyecto? Proyecto { get; set; }
}