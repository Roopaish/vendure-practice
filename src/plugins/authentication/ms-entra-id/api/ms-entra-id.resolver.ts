import { Args, Query, Resolver } from "@nestjs/graphql";
import { Ctx, RequestContext } from "@vendure/core";
import { MSEntraIDService } from "../services/ms-entra-id.service";

@Resolver()
export class MSEntraIDResolver {
  constructor(private msEntraIdService: MSEntraIDService) {}

  @Query()
  getAuthCodeUrl(
    @Ctx() ctx: RequestContext,
    @Args() { redirectURI }: { redirectURI?: string }
  ) {
    return this.msEntraIdService.getAuthCodeUrl(redirectURI);
  }
}
