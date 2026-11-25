from pydantic import BaseModel


class ClaimInput(BaseModel):
    # Numerical
    WeekOfMonth: int
    WeekOfMonthClaimed: int
    Age: int
    Deductible: int
    DriverRating: int

    # Categorical
    Month: str
    DayOfWeek: str
    Make: str
    AccidentArea: str
    DayOfWeekClaimed: str
    MonthClaimed: str
    Sex: str
    MaritalStatus: str
    Fault: str
    PolicyType: str
    VehicleCategory: str
    VehiclePrice: str
    Days_Policy_Accident: str
    Days_Policy_Claim: str
    PastNumberOfClaims: str
    AgeOfVehicle: str
    AgeOfPolicyHolder: str
    PoliceReportFiled: str
    WitnessPresent: str
    AgentType: str
    NumberOfSuppliments: str
    AddressChange_Claim: str
    NumberOfCars: str
    BasePolicy: str
