using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CloneTwiAPI.Models;

public partial class CloneTwiContext : IdentityDbContext<ApplicationUser>
{
    public CloneTwiContext()
    {
    }

    public CloneTwiContext(DbContextOptions<CloneTwiContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AudioMessage> AudioMessages { get; set; }

    public virtual DbSet<Bookmark> Bookmarks { get; set; }

    public virtual DbSet<EmojiMessage> EmojiMessages { get; set; }

    public virtual DbSet<FollowUser> FollowUsers { get; set; }

    public virtual DbSet<Message> Messages { get; set; }

    public virtual DbSet<Repost> Reposts { get; set; }

    public virtual DbSet<ThemeMessage> ThemeMessages { get; set; }

    public virtual DbSet<VideoMessage> VideoMessages { get; set; }

    public virtual DbSet<View> Views { get; set; }

    public virtual DbSet<Interest> Interests { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlServer("Fallback");
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AudioMessage>(entity =>
        {
            entity.HasKey(e => e.AudioId).HasName("PK__AudioMes__A28A945054A6EAAE");

            entity.ToTable("AudioMessage");

            entity.Property(e => e.AudioMessageId).HasColumnName("Audio_MessageId");

            entity.HasOne(d => d.AudioMessageNavigation).WithMany(p => p.AudioMessages)
                .HasForeignKey(d => d.AudioMessageId)
                .HasConstraintName("FK_Audio_Message");
        });

        modelBuilder.Entity<Bookmark>(entity =>
        {
            entity.HasKey(e => e.BookmarkId).HasName("PK__Bookmark__541A3B714D2C4593");

            entity.ToTable("Bookmark");

            entity.HasIndex(e => new { e.BookmarkUserId, e.BookmarkMessageId }, "UQ__Bookmark__C997EFB2805DBA76").IsUnique();

            entity.Property(e => e.BookmarkMessageId).HasColumnName("Bookmark_MessageId");
            entity.Property(e => e.BookmarkUserId).HasColumnName("Bookmark_UserId");

            entity.HasOne(d => d.BookmarkMessage).WithMany(p => p.Bookmarks)
                .HasForeignKey(d => d.BookmarkMessageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Bookmark_Message");
        });

        modelBuilder.Entity<EmojiMessage>(entity =>
        {
            entity.HasKey(e => e.EmojiId).HasName("PK__EmojiMes__D584B2331210B021");

            entity.ToTable("EmojiMessage");

            entity.Property(e => e.EmojiMessageId).HasColumnName("Emoji_MessageId");
            entity.Property(e => e.EmojiUserId)
                .HasMaxLength(450)
                .HasColumnName("Emoji_UserId");
            entity.Property(e => e.EmojiValue)
                .HasMaxLength(100)
                .UseCollation("Latin1_General_100_CI_AI_SC_UTF8");

            entity.HasOne(d => d.EmojiMessageNavigation).WithMany(p => p.EmojiMessages)
                .HasForeignKey(d => d.EmojiMessageId)
                .HasConstraintName("FK_Emoji_Message");
        });

        modelBuilder.Entity<FollowUser>(entity =>
        {
            entity.HasKey(e => e.FollowId).HasName("PK__FollowUs__2CE810AE6B0CE6C7");

            entity.ToTable("FollowUser");

            entity.Property(e => e.FollowerUserId).HasColumnName("Follower_UserId");
            entity.Property(e => e.FollowingUserId).HasColumnName("Following_UserId");

            entity.HasOne(f => f.Follower)
                  .WithMany(u => u.Following)
                  .HasForeignKey(f => f.FollowerUserId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(f => f.Following)
                  .WithMany(u => u.Follower)
                  .HasForeignKey(f => f.FollowingUserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PK__Message__C87C0C9C29E64AE8");

            entity.ToTable("Message");

            entity.Property(e => e.MessageIsEdited).HasDefaultValue(false);
            entity.Property(e => e.IsStory).HasDefaultValue(false);
            entity.Property(e => e.MessageParentId).HasColumnName("Message_ParentId");
            entity.Property(e => e.MessagePreviousVersionId).HasColumnName("Message_PreviousVersionId");
            entity.Property(e => e.MessageUserId)
                .HasMaxLength(450)
                .HasColumnName("Message_UserId");

            entity.HasOne(d => d.MessageParent).WithMany(p => p.InverseMessageParent)
                .HasForeignKey(d => d.MessageParentId)
                .HasConstraintName("FK_Message_Parent");

            entity.HasOne(d => d.MessagePreviousVersion).WithMany(p => p.InverseMessagePreviousVersion)
                .HasForeignKey(d => d.MessagePreviousVersionId)
                .HasConstraintName("FK_Message_PreviousVersion");
        });

        modelBuilder.Entity<Repost>(entity =>
        {
            entity.HasKey(e => e.RepostId).HasName("PK__Repost__5E7F921E2A5B4E12");

            entity.ToTable("Repost");

            entity.HasIndex(e => new { e.RepostUserId, e.RepostMessageId }, "UQ__Repost__0E305DA4A1F284DD").IsUnique();

            entity.Property(e => e.RepostMessageId).HasColumnName("Repost_MessageId");
            entity.Property(e => e.RepostUserId).HasColumnName("Repost_UserId");

            entity.HasOne(d => d.RepostMessage).WithMany(p => p.Reposts)
                .HasForeignKey(d => d.RepostMessageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Repost_Message");
        });

        modelBuilder.Entity<ThemeMessage>(entity =>
        {
            entity.HasKey(e => e.ThemeId).HasName("PK__ThemeMes__FBB3E4D9E8247617");

            entity.ToTable("ThemeMessage");

            entity.Property(e => e.ThemeMessageId).HasColumnName("Theme_MessageId");
            entity.Property(e => e.ThemeType).HasMaxLength(100);

            entity.HasOne(d => d.ThemeMessageNavigation).WithMany(p => p.ThemeMessages)
                .HasForeignKey(d => d.ThemeMessageId)
                .HasConstraintName("FK_Theme_Message");
        });

        modelBuilder.Entity<VideoMessage>(entity =>
        {
            entity.HasKey(e => e.VideoId).HasName("PK__VideoMes__BAE5126A7392D3BC");

            entity.ToTable("VideoMessage");

            entity.Property(e => e.VideoMessageId).HasColumnName("Video_MessageId");

            entity.HasOne(d => d.VideoMessageNavigation).WithMany(p => p.VideoMessages)
                .HasForeignKey(d => d.VideoMessageId)
                .HasConstraintName("FK_Video_Message");
        });

        modelBuilder.Entity<View>(entity =>
        {
            entity.HasKey(e => e.ViewId).HasName("PK__View__1E371CF61A783FC4");

            entity.ToTable("View");

            entity.Property(e => e.ViewMessageId).HasColumnName("View_MessageId");
            entity.Property(e => e.ViewUserId)
                .HasMaxLength(450)
                .HasColumnName("View_UserId");

            entity.HasOne(d => d.ViewMessage).WithMany(p => p.Views)
                .HasForeignKey(d => d.ViewMessageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_View_Message");
        });

        modelBuilder.Entity<Interest>(entity =>
        {
            entity.HasKey(e => e.InterestId).HasName("PK__Interest__1E371CF61A783FC5");

            entity.ToTable("Interest");

            entity.Property(e => e.InterestTopic)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(e => e.InterestUserId)
                .HasMaxLength(450);

            entity.HasOne(e => e.User)
                  .WithMany(u => u.Interests)
                  .HasForeignKey(e => e.InterestUserId)
                  .OnDelete(DeleteBehavior.Cascade);

        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
