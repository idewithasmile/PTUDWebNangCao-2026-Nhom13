namespace CulinaryBlog.API.Endpoints;

public static class RecipesEndpoints
{
    public static RouteGroupBuilder MapRecipesEndpoints(this RouteGroupBuilder group)
    {
        // Thành viên C & D sẽ thêm các routes recipe, steps, ingredients, images
        return group;
    }
}
