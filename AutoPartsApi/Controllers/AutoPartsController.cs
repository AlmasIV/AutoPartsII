using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using AutoPartsApi.Models;

namespace AutoPartsApi.Controllers;

[ApiController]
[Route("auto-parts")]
public class AutoPartController : ControllerBase {
    private readonly AppDbContext _AppDbContext;
    public AutoPartController(AppDbContext appDbContext){
        _AppDbContext = appDbContext;
    }

    [HttpGet]
    [Route("all")]
    public async Task<IEnumerable<AutoPart>> GetAll(){
        return await _AppDbContext.AutoParts.AsNoTracking().ToArrayAsync();
    }

    [HttpPost]
    [Route("create")]
    public async Task Post([FromBody] AutoPart autoPart){
        await _AppDbContext.AutoParts.AddAsync(autoPart);
        await _AppDbContext.SaveChangesAsync();
    }
}