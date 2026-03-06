using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResearchManager.API.Data;
using ResearchManager.API.Models;

namespace ResearchManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvestigadoresProyController : ControllerBase
{
    private readonly AppDbContext _context;

    public InvestigadoresProyController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/investigadoresproy/investigador/5
    // → Todos los proyectos de un investigador
    [HttpGet("investigador/{idInv}")]
    public async Task<IActionResult> GetProyectosPorInvestigador(int idInv)
    {
        var resultado = await _context.InvestigadoresProy
            .Where(ip => ip.IdInv == idInv)
            .Include(ip => ip.Proyecto) // ← Trae los datos del proyecto también
            .ToListAsync();

        return Ok(resultado);
    }

    // GET: api/investigadoresproy/proyecto/5
    // → Todos los investigadores de un proyecto
    [HttpGet("proyecto/{idProy}")]
    public async Task<IActionResult> GetInvestigadoresPorProyecto(int idProy)
    {
        var resultado = await _context.InvestigadoresProy
            .Where(ip => ip.IdProy == idProy)
            .Include(ip => ip.Investigador) // ← Trae los datos del investigador también
            .ToListAsync();

        return Ok(resultado);
    }

    // POST: api/investigadoresproy
    // → Asignar un investigador a un proyecto
    [HttpPost]
    public async Task<IActionResult> Asignar(InvestigadorProy relacion)
    {
        var existe = await _context.InvestigadoresProy
            .AnyAsync(ip => ip.IdInv == relacion.IdInv && ip.IdProy == relacion.IdProy);

        if (existe) return Conflict("El investigador ya está asignado a ese proyecto");

        _context.InvestigadoresProy.Add(relacion);
        await _context.SaveChangesAsync();
        return Ok(relacion);
    }

    // DELETE: api/investigadoresproy/5/3
    // → Quitar un investigador de un proyecto
    [HttpDelete("{idInv}/{idProy}")]
    public async Task<IActionResult> Quitar(int idInv, int idProy)
    {
        var relacion = await _context.InvestigadoresProy
            .FindAsync(idInv, idProy);

        if (relacion == null) return NotFound();

        _context.InvestigadoresProy.Remove(relacion);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}