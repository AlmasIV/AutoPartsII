using AutoPartsApi.DTOs;
using AutoPartsApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Filters;

namespace AutoPartsApi.Filters;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
public class OrderSummaryValidationAttribute : Attribute, IAsyncActionFilter {
    private readonly AppDbContext _appDbContext;
    public OrderSummaryValidationAttribute(AppDbContext appDbContext){
        _appDbContext = appDbContext;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next){
        OrderSummary? orderSummary = context.ActionArguments["orderSummary"] as OrderSummary;
        
        if(orderSummary is null){
            context.Result = new ObjectResult(
                new ProblemDetails(){
                    Detail = "Internal error. Something bad happened. Contact the devs.",
                    Instance = "Required data wasn't present.",
                    Status = StatusCodes.Status500InternalServerError,
                    Title = "Internal error.",
                    Type = null
                }
            );
            return;
        }

        List<AutoPart>? originalInfo = await _appDbContext.AutoParts
            .AsNoTracking()
            .Where(ap => orderSummary.OrderedParts.Select(x => x.Id).Contains(ap.Id))
            .Include(ap => ap.Orders)
            .ToListAsync();
        
        if(originalInfo is null || originalInfo.Count() != orderSummary.OrderedParts.Length){
            context.Result = new ObjectResult(
                new ProblemDetails(){
                    Detail = "Ordered parts are inconsistent with the data from the database. Refresh the page, and try again.",
                    Instance = $"IDs: {string.Join(", ", orderSummary.OrderedParts.Select(ap => ap.Name))}.",
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Data inconsistency.",
                    Type = null
                }
            );
            return;
        }

        decimal calculatedPrice = (from ap in orderSummary.OrderedParts
            let op = originalInfo!.Single(op => op.Id == ap.Id)
            select ap.Amount * op.PriceInKzt).Sum();
        
        if(orderSummary.TotalPriceInKzt != calculatedPrice){
            context.Result = new ObjectResult(
                new ProblemDetails(){
                    Detail = "Computed price is inconsitent with the provided price. Prices might be modified. Try to reload the page, and reselect the items.",
                    Instance = $"Requested price: {orderSummary.TotalPriceInKzt}, computed price: {calculatedPrice}.",
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Price inconsistency.",
                    Type = null
                }
            );
            return;
        }

        AutoPart? temp = null;
        foreach(AutoPart orderedPart in orderSummary.OrderedParts){
            temp = originalInfo.SingleOrDefault(ap => ap.Id == orderedPart.Id);
            if(!orderedPart.Equals(temp)){
                context.Result = new ObjectResult(
                    new ProblemDetails(){
                        Detail = "Fields of the requested data are inconsistent with the data from the database. Fields might be modified. Try to reload the page, and reselect the items.",
                        Instance = $"ID: {orderedPart.Id}.",
                        Status = StatusCodes.Status400BadRequest,
                        Title = "Field inconsistency.",
                        Type = null
                    }
                );
                return;
            }
            else if(temp.Amount < orderedPart.Amount){
                context.Result = new ObjectResult(
                    new ProblemDetails(){
                        Detail = "Ordered more than we have. Amount might be modified. Try to reload the page, and reselect the items.",
                        Instance = $"ID: {orderedPart.Id}.",
                        Status = StatusCodes.Status400BadRequest,
                        Title = "Amount is outdated.",
                        Type = null
                    }
                );
                return;
            }
        }

        await next();
    }
}