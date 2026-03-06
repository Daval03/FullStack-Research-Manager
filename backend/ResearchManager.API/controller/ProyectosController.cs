using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResearchManager.API.Data;
using ResearchManager.API.Models;

namespace ResearchManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProyectosController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProyectosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _context.Proyectos.ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var proyecto = await _context.Proyectos.FindAsync(id);
        return proyecto == null ? NotFound() : Ok(proyecto);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Proyecto proyecto)
    {
        _context.Proyectos.Add(proyecto);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = proyecto.IdPry }, proyecto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Proyecto proyecto)
    {
        if (id != proyecto.IdPry) return BadRequest();
        _context.Proyectos.Update(proyecto);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var proyecto = await _context.Proyectos.FindAsync(id);
        if (proyecto == null) return NotFound();
        _context.Proyectos.Remove(proyecto);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}