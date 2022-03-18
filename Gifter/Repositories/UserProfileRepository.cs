using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Gifter.Models;
using Gifter.Utils;

namespace Gifter.Repositories
{
    public class UserProfileRepository : BaseRepository, IUserProfileRepository
    {
        
        
        
        public UserProfileRepository(IConfiguration configuration) : base(configuration) { }

        public UserProfile GetByEmail(string email)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                          SELECT Id, Name, Email, ImageUrl, Bio, DateCreated FROM UserProfile WHERE Email = @email";
                    cmd.Parameters.AddWithValue("@email", email);



                    var reader = cmd.ExecuteReader();

                    UserProfile user = null;
                    if (reader.Read())
                    {
                        user = new UserProfile()
                        {
                            Id = DbUtils.GetInt(reader, "iD"),
                            Name = DbUtils.GetString(reader, "Name"),
                            Email = DbUtils.GetString(reader, "Email"),
                            DateCreated = DbUtils.GetDateTime(reader, "DateCreated"),
                            ImageUrl = DbUtils.GetString(reader, "ImageUrl")
                        };
                    }

                    reader.Close();

                    return user;
                }
            }
        }


        public void Add(UserProfile user)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        INSERT INTO UserProfile (Name, Email, ImageUrl, Bio, DateCreated)
                        OUTPUT INSERTED.ID
                        VALUES (@Name, @Email, @ImageUrl,  @Bio, @DateCreated)";

                    DbUtils.AddParameter(cmd, "@Name", user.Name);
                    DbUtils.AddParameter(cmd, "@Email", user.Email);
                    DbUtils.AddParameter(cmd, "@Bio", user.Bio);
                    DbUtils.AddParameter(cmd, "@ImageUrl", user.ImageUrl);
                    DbUtils.AddParameter(cmd, "@DateCreated", DateTime.Now);

                    user.Id = (int)cmd.ExecuteScalar();
                }
            }
        }

        public List<UserProfile> GetAll()
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                    SELECT Id AS UserProfileId, Name, Bio, Email, DateCreated AS UserProfileDateCreated, 
                       ImageUrl AS UserProfileImageUrl
                     FROM UserProfile
                    ";

                    var reader = cmd.ExecuteReader();

                    var posts = new List<UserProfile>();
                    while (reader.Read())
                    {
                        posts.Add(new UserProfile()
                        {
                            Id = DbUtils.GetInt(reader, "UserProfileId"),
                            Name = DbUtils.GetString(reader, "Name"),
                            Email = DbUtils.GetString(reader, "Email"),
                            DateCreated = DbUtils.GetDateTime(reader, "UserProfileDateCreated"),
                            ImageUrl = DbUtils.GetString(reader, "UserProfileImageUrl"),
                        });
                    }

                    reader.Close();

                    return posts;
                }
            }
        }


        public UserProfile GetById(int id)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        SELECT up.Id AS UserProfileId, up.[Name], up.Bio, up.Email, up.DateCreated AS UserProfileDateCreated, 
                        up.ImageUrl AS UserProfileImageUrl,
                        p.id AS PostId, p.Title AS PostTitle, p.ImageUrl AS PostImage, p.Caption AS PostCaption, p.DateCreated AS PostDateCreated,
                        c.Id AS CommentId, c.Message, c.UserProfileId AS CommentUserProfileId
                        FROM UserProfile up
                        LEFT JOIN Post p on p.UserProfileId = up.Id
                        LEFT JOIN Comment c on c.PostId = p.id
                        WHERE up.Id = @Id";

                    DbUtils.AddParameter(cmd, "@Id", id);

                    var reader = cmd.ExecuteReader();
                    UserProfile userProfile = null;
                    var posts = new List<Post>();
                    //Needs to be while in order to get more than one post in list
                    while (reader.Read())
                    {   
                        //needs if (statement to make only on userProfile
                        if (userProfile == null)
                        {
                            userProfile = new UserProfile()
                            {
                                Id = DbUtils.GetInt(reader, "UserProfileId"),
                                Name = DbUtils.GetString(reader, "Name"),
                                Email = DbUtils.GetString(reader, "Email"),
                                DateCreated = DbUtils.GetDateTime(reader, "UserProfileDateCreated"),
                                ImageUrl = DbUtils.GetString(reader, "UserProfileImageUrl"),
                                Posts = posts
                            };
                        }

                        var postId = DbUtils.GetInt(reader, "PostId");

                        //check to see if (the post has comments and if any things in the post matches anything on the list of posts
                        if (DbUtils.IsNotDbNull(reader, "PostId") && !userProfile.Posts.Any(singlePost => singlePost.Id == DbUtils.GetInt(reader, "PostId")))
                        {
                            userProfile.Posts.Add(new Post()
                            {
                                Id = DbUtils.GetInt(reader, "PostId"),
                                Title = DbUtils.GetString(reader, "PostTitle"),
                                ImageUrl = DbUtils.GetString(reader, "PostImage"),
                                Caption = DbUtils.GetString(reader, "PostCaption"),
                                UserProfileId = DbUtils.GetInt(reader, "UserProfileId"),
                                DateCreated = DbUtils.GetDateTime(reader, "PostDateCreated"),
                                Comments = new List<Comment>()
                                {
                                    new Comment()
                                    {
                                        Id =DbUtils.GetInt(reader,"CommentId"),
                                        Message =DbUtils.GetString(reader,"Message")
                                    }
                                }
                                
                            
                            });

                        }
                        //This will run when there is already a post 
                        if(DbUtils.IsNotDbNull(reader, "PostId") && userProfile.Posts.Any(singlePost => singlePost.Id == DbUtils.GetInt(reader, "PostId")))
                        {
                            //go into list of posts
                            var postToAddCommentTo = userProfile.Posts.FirstOrDefault(p => p.Id == DbUtils.GetInt(reader, "PostId"));
                            //find the one that matches the current post id of the current row i'm on
                            postToAddCommentTo.Comments.Add(new Comment()
                            {
                                Id = DbUtils.GetInt(reader, "CommentId"),
                                Message = DbUtils.GetString(reader, "Message")
                            });
                            
                        }
                        //if (DbUtils.IsNotDbNull(reader, "CommentId"))
                        //{
                        //    post.Comments.Add(new Comment()
                        //    {
                        //        Id = DbUtils.GetInt(reader, "CommentId"),
                        //        Message = DbUtils.GetString(reader, "Message"),
                        //        PostId = id,
                        //        UserProfileId = DbUtils.GetInt(reader, "CommentUserProfileId")
                        //    });
                        //}

                    }
                    reader.Close();

                    return userProfile;
                }
            }
        }

        public UserProfile GetUserProfileIdWithPostsAndComments(int id)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                SELECT  p.Id As PostId, p.Title, p.Caption, p.DateCreated AS PostDateCreated,
                       p.ImageUrl AS PostImageUrl, p.UserProfileId AS PostUserProfileId,

                      up.Id AS UserProfileId, up.Name, up.Bio, up.Email, up.DateCreated AS UserProfileDateCreated,
                       up.ImageUrl AS UserProfileImageUrl,
                       c.Id AS CommentId, c.Message, c.UserProfileId AS CommentUserProfileId, c.PostId AS CommentPostId

                  FROM UserProfile up
                       LEFT JOIN Post p ON p.UserProfileId = up.id
                        LEFT JOIN Comment c on c.PostId = p.id
                       WHERE up.Id = @Id
              ORDER BY up.DateCreated";

                    DbUtils.AddParameter(cmd, "@Id", id);

                    var reader = cmd.ExecuteReader();

                    UserProfile user = null;
                    var posts = new List<Post>();
                    while (reader.Read())
                    {
                        if (user == null)

                        {
                            user = new UserProfile()
                            {


                                Id = id,
                                Name = DbUtils.GetString(reader, "Name"),
                                Email = DbUtils.GetString(reader, "Email"),
                                DateCreated = DbUtils.GetDateTime(reader, "UserProfileDateCreated"),
                                ImageUrl = DbUtils.GetString(reader, "UserProfileImageUrl"),
                                Bio = DbUtils.GetString(reader, "Bio"),

                                Posts = posts

                            };

                        }

                        var postId = DbUtils.GetInt(reader, "PostId");

                        if (DbUtils.IsNotDbNull(reader, "PostUserProfileId") && !posts.Contains(posts.FirstOrDefault(p => p.Id == postId)))
                        {

                            user.Posts.Add(new Post()
                            {
                                Id = postId,
                                Title = DbUtils.GetString(reader, "Title"),
                                Caption = DbUtils.GetString(reader, "Caption"),
                                DateCreated = DbUtils.GetDateTime(reader, "PostDateCreated"),
                                ImageUrl = DbUtils.GetString(reader, "PostImageUrl"),
                                UserProfileId = id,
                                UserProfile = new UserProfile()
                                {
                                    Name = DbUtils.GetString(reader, "Name"),
                                    Email = DbUtils.GetString(reader, "Email"),
                                    DateCreated = DbUtils.GetDateTime(reader, "UserProfileDateCreated"),
                                    ImageUrl = DbUtils.GetString(reader, "UserProfileImageUrl"),
                                },

                                Comments = new List<Comment>()



                            });


                        }

                        foreach (var post in posts)
                        {


                            if (DbUtils.IsNotDbNull(reader, "CommentId") && post.Id == postId)
                            {
                                post.Comments.Add(new Comment()
                                {
                                    Id = DbUtils.GetInt(reader, "CommentId"),
                                    Message = DbUtils.GetString(reader, "Message"),
                                    PostId = postId,
                                    UserProfileId = id,
                                    UserProfile = new UserProfile()
                                    {
                                        Name = DbUtils.GetString(reader, "Name"),
                                        Email = DbUtils.GetString(reader, "Email"),
                                        DateCreated = DbUtils.GetDateTime(reader, "UserProfileDateCreated"),
                                        ImageUrl = DbUtils.GetString(reader, "UserProfileImageUrl"),
                                    }
                                });
                            }

                        }

                    }

                    reader.Close();

                    return user;
                }
            }
        }



        

        public void Update(UserProfile userProfile)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        UPDATE UserProfile
                           SET Name = @Name,
                               Email = @Email,
                               ImageUrl = @ImageUrl,
                               DateCreated = @DateCreaded
                         WHERE Id = @Id";

                    DbUtils.AddParameter(cmd, "@Name", userProfile.Name);
                    DbUtils.AddParameter(cmd, "@Email", userProfile.Email);
                    DbUtils.AddParameter(cmd, "@ImageUrl", userProfile.ImageUrl);
                    DbUtils.AddParameter(cmd, "@DateCreated", userProfile.DateCreated);
                    DbUtils.AddParameter(cmd, "@Id", userProfile.Id);

                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void Delete(int id)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "DELETE FROM UserProfile WHERE Id = @Id";
                    DbUtils.AddParameter(cmd, "@id", id);
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}