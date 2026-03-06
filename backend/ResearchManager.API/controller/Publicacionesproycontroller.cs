using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResearchManager.API.Data;
using ResearchManager.API.Models;

namespace ResearchManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PublicacionesProyController : ControllerBase
{
    private readonly AppDbContext _context;

    public PublicacionesProyController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/publicacionesproy/proyecto/5
    // → Todas las publicaciones de un proyecto
    [HttpGet("proyecto/{idProyecto}")]
    public async Task<IActionResult> GetPublicacionesPorProyecto(int idProyecto)
    {
        var resultado = await _context.PublicacionesProy
            .Where(pp => pp.IdProyecto == idProyecto)
            .Include(pp => pp.Publicacion)
            .ToListAsync();

        return Ok(resultado);
    }

    // GET: api/publicacionesproy/publicacion/5
    // → Todos los proyectos de una publicación
    [HttpGet("publicacion/{idArt}")]
    public async Task<IActionResult> GetProyectosPorPublicacion(int idArt)
    {
        var resultado = await _context.PublicacionesProy
            .Where(pp => pp.IdArt == idArt)
            .Include(pp => pp.Proyecto)
            .ToListAsync();

        return Ok(resultado);
    }

    // POST: api/publicacionesproy
    // → Asignar una publicación a un proyecto
    [HttpPost]
    public async Task<IActionResult> Asignar(PublicacionProy relacion)
    {
        var existe = await _context.PublicacionesProy
            .AnyAsync(pp => pp.IdProyecto == relacion.IdProyecto && pp.IdArt == relacion.IdArt);

        if (existe) return Conflict("La publicación ya está asignada a ese proyecto.");

        _context.PublicacionesProy.Add(relacion);
        await _context.SaveChangesAsync();
        return Ok(relacion);
    }

    // DELETE: api/publicacionesproy/5/3
    // → Quitar una publicación de un proyecto
    [HttpDelete("{idProyecto}/{idArt}")]
    public async Task<IActionResult> Quitar(int idProyecto, int idArt)
    {
        var relacion = await _context.PublicacionesProy
            .FindAsync(idProyecto, idArt);

        if (relacion == null) return NotFound();

        _context.PublicacionesProy.Remove(relacion);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}