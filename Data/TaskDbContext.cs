using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Models;

namespace TaskManager.Api.Data;

public class TaskDbContext : DbContext
{
    public TaskDbContext(DbContextOptions<TaskDbContext> options) : base(options)
    {
    }

    public DbSet<TaskItem> Tasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.ToTable("tasks");
            
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Id)
                .HasColumnName("id");
            
            entity.Property(e => e.Title)
                .HasColumnName("title")
                .IsRequired()
                .HasMaxLength(500);
            
            entity.Property(e => e.Description)
                .HasColumnName("description");
            
            entity.Property(e => e.Status)
                .HasColumnName("status")
                .IsRequired()
                .HasMaxLength(50);
            
            entity.Property(e => e.Priority)
                .HasColumnName("priority")
                .IsRequired()
                .HasMaxLength(50);
            
            entity.Property(e => e.DueDate)
                .HasColumnName("due_date");
            
            entity.Property(e => e.CreatedBy)
                .HasColumnName("created_by")
                .HasMaxLength(100);
            
            entity.Property(e => e.CreatedAt)
                .HasColumnName("created_at")
                .IsRequired();
            
            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updated_at");
        });
    }
}
