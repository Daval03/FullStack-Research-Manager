// Data/AppDbContext.cs
using Microsoft.EntityFrameworkCore;
using ResearchManager.API.Models;

namespace ResearchManager.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Investigador> Investigadores { get; set; }
    public DbSet<Proyecto> Proyectos { get; set; } 
    public DbSet<InvestigadorProy> InvestigadoresProy { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder){
        // ← Definir la PK compuesta
        modelBuilder.Entity<InvestigadorProy>()
            .HasKey(ip => new { ip.IdInv, ip.IdProy });
        // ← Definir las relaciones FK
        modelBuilder.Entity<InvestigadorProy>()
            .HasOne(ip => ip.Investigador)
            .WithMany()
            .HasForeignKey(ip => ip.IdInv);

        modelBuilder.Entity<InvestigadorProy>()
            .HasOne(ip => ip.Proyecto)
            .WithMany()
            .HasForeignKey(ip => ip.IdProy);
    }
}