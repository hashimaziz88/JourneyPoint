namespace JourneyPoint.Sessions.Dto
{
    /// <summary>
    /// Represents the current authenticated application, tenant, and user context payload.
    /// </summary>
    public class GetCurrentLoginInformationsOutput
    {
        public ApplicationInfoDto Application { get; set; }

        public UserLoginInfoDto User { get; set; }

        public TenantLoginInfoDto Tenant { get; set; }
    }
}
