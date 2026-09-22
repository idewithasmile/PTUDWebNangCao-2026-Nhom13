namespace CulinaryBlog.API.Endpoints;

public static class CategoriesEndpoints
{
    public static RouteGroupBuilder MapCategoriesEndpoints(this RouteGroupBuilder group)
    {
        // Thành viên B sẽ thêm các routes: GET /, GET /{slug}, POST /, PUT /{id}, DELETE /{id}
        return group;
    }
}
