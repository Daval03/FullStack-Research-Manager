using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configurar DbContext con PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Endpoint para obtener todos los investigadores
app.MapGet("/investigadores", async (ApplicationDbContext db) =>
{
    var investigadores = await db.Investigadores.ToListAsync();
    return investigadores;
})
.WithName("GetInvestigadores")
.WithOpenApi();

// Endpoint para obtener un investigador por ID
app.MapGet("/investigadores/{id}", async (int id, ApplicationDbContext db) =>
{
    var investigador = await db.Investigadores.FindAsync(id);
    return investigador is not null ? Results.Ok(investigador) : Results.NotFound();
})
.WithName("GetInvestigadorById")
.WithOpenApi();

// Endpoint para insertar un nuevo investigador
app.MapPost("/investigadores", async (Investigador investigador, ApplicationDbContext db) =>
{
    db.Investigadores.Add(investigador);
    await db.SaveChangesAsync();
    
    return Results.Created($"/investigadores/{investigador.Id}", investigador);
})
.WithName("CreateInvestigador")
.WithOpenApi();

// Endpoint para actualizar un investigador
app.MapPut("/investigadores/{id}", async (int id, Investigador inputInvestigador, ApplicationDbContext db) =>
{
    var investigador = await db.Investigadores.FindAsync(id);
    
    if (investigador is null) return Results.NotFound();
    
    investigador.NombreCompleto = inputInvestigador.NombreCompleto;
    investigador.TituloAcademico = inputInvestigador.TituloAcademico;
    investigador.Institucion = inputInvestigador.Institucion;
    investigador.Email = inputInvestigador.Email;
    
    await db.SaveChangesAsync();
    
    return Results.Ok(investigador);
})
.WithName("UpdateInvestigador")
.WithOpenApi();

// Endpoint para eliminar un investigador
app.MapDelete("/investigadores/{id}", async (int id, ApplicationDbContext db) =>
{
    var investigador = await db.Investigadores.FindAsync(id);
    
    if (investigador is null) return Results.NotFound();
    
    db.Investigadores.Remove(investigador);
    await db.SaveChangesAsync();
    
    return Results.NoContent();
})
.WithName("DeleteInvestigador")
.WithOpenApi();

app.Run();

// Modelo para la tabla investigadores
public class Investigador
{
    public int Id { get; set; }
    public string? NombreCompleto { get; set; }
    public string? TituloAcademico { get; set; }
    public string? Institucion { get; set; }
    public string? Email { get; set; }
}

// DbContext para la conexión
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Investigador> Investigadores { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurar la entidad Investigador
        modelBuilder.Entity<Investigador>(entity =>
        {
            entity.ToTable("investigadores"); // Nombre de la tabla en PostgreSQL
            entity.HasKey(e => e.Id); // Clave primaria
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.NombreCompleto)
                .HasColumnName("nombre_completo")
                .HasMaxLength(200);
            entity.Property(e => e.TituloAcademico)
                .HasColumnName("titulo_academico")
                .HasMaxLength(50);
            entity.Property(e => e.Institucion)
                .HasColumnName("institucion")
                .HasMaxLength(50);
            entity.Property(e => e.Email)
                .HasColumnName("email")
                .HasMaxLength(100);
        });
    }
}