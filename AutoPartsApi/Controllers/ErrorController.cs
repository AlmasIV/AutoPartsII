using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

// What is this? I need to create it?

namespace AutoPartsApi.Controllers;

[ApiController()]
public class ErrorController : ControllerBase {
    private readonly AppDbContext _appDbContext;
    public ErrorController(AppDbContext appDbContext){
        _appDbContext = appDbContext;
    }
    [Route("/error")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public IActionResult HandleError(){
        return Problem();
}
    }