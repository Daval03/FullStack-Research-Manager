using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResearchManager.API.Data;
using ResearchManager.API.Models;

namespace ResearchManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PublicacionesController : ControllerBase
{
    private readonly AppDbContext _context;

    public PublicacionesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/publicaciones
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _context.Publicaciones.ToListAsync());

    // GET: api/publicaciones/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var publicacion = await _context.Publicaciones.FindAsync(id);
        return publicacion == null ? NotFound() : Ok(publicacion);
    }

    // POST: api/publicaciones
    [HttpPost]
    public async Task<IActionResult> Create(Publicacion publicacion)
    {
        _context.Publicaciones.Add(publicacion);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = publicacion.IdPub }, publicacion);
    }

    // PUT: api/publicaciones/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Publicacion publicacion)
    {
        if (id != publicacion.IdPub) return BadRequest();
        _context.Publicaciones.Update(publicacion);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/publicaciones/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var publicacion = await _context.Publicaciones.FindAsync(id);
        if (publicacion == null) return NotFound();
        _context.Publicaciones.Remove(publicacion);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}