using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResearchManager.API.Data;
using ResearchManager.API.Models;

namespace ResearchManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvestigadoresController : ControllerBase
{
    private readonly AppDbContext _context;

    public InvestigadoresController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/investigadores
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var lista = await _context.Investigadores.ToListAsync();
        return Ok(lista);
    }

    // GET: api/investigadores/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var inv = await _context.Investigadores.FindAsync(id);
        if (inv == null) return NotFound();
        return Ok(inv);
    }

    // POST: api/investigadores
    [HttpPost]
    public async Task<IActionResult> Create(Investigador investigador)
    {
        _context.Investigadores.Add(investigador);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = investigador.Id }, investigador);
    }

    // PUT: api/investigadores/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Investigador investigador)
    {
        if (id != investigador.Id) return BadRequest();
        _context.Investigadores.Update(investigador);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/investigadores/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var inv = await _context.Investigadores.FindAsync(id);
        if (inv == null) return NotFound();
        _context.Investigadores.Remove(inv);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}