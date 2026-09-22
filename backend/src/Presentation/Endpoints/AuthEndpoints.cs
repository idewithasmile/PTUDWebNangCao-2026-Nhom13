namespace CulinaryBlog.API.Endpoints;

public static class AuthEndpoints
{
    public static RouteGroupBuilder MapAuthEndpoints(this RouteGroupBuilder group)
    {
        // Thành viên A sẽ thêm các routes: /register, /login, /google, /refresh, /logout, /me
        return group;
    }
}
