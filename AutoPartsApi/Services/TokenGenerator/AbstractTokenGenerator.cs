using AutoPartsApi.Models;

using Microsoft.AspNetCore.Identity;

namespace AutoPartsApi.Services;

/*
	1) Maybe separate interfaces? ANSWER: No, because I am not using interfaces. I replaced it with the abstract class.
	2) Do I need to use interfaces or abstract classes in my case? ANSWER: Using abstract classes because:
		1. logically TokenGenerator close to the base class, rather than interface (at least it seems so to me).
		2. "async" methods in interfaces must have a default body, which looks ugly. P.S. I have to declare a body for any "async" method, but I can declare abstract method that returns "Task", and then in a derived class I can make it "async". Can't use DbContext in a singleton-scoped service.
	3) Document it?
*/

public abstract class AbstractTokenGenerator {
	public abstract string GenerateToken(IdentityUser user);
	public abstract Guid GenerateRefreshToken();
}