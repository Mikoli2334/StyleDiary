using KStyleDiary.Models;
using Microsoft.EntityFrameworkCore;
namespace KStyleDiary.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Look> Looks { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<LookProduct> LookProducts { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        
        base.OnModelCreating(builder);
        builder.Entity<LookProduct>()
            .HasKey(lp=>new{lp.LookId,lp.ProductId});
        builder.Entity<LookProduct>()
            .HasOne(lp => lp.Look)
            .WithMany(l => l.LookProducts)
            .HasForeignKey(lp => lp.LookId);
        
        builder.Entity<LookProduct>()
            .HasOne(lp => lp.Product)
            .WithMany(p=>p.LookProducts)
            .HasForeignKey(lp => lp.ProductId);
    }

    }

