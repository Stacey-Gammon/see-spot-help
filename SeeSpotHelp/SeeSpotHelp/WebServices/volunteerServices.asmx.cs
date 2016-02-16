﻿using System.Web.Services;
using Newtonsoft.Json;

namespace SeeSpotHelp.WebServices
{
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class volunteerServices : System.Web.Services.WebService
    {
        [WebMethod]
        public VolunteerResult getVolunteer(string anID, string name, string email)
        {
            VolunteersNS.Volunteer volunteer = new VolunteersNS.Volunteer(
                Helpers.DBHelper.BuildConnectionString("AnimalShelter"), anID,name,email);
            var json = JsonConvert.SerializeObject(volunteer);
            VolunteerResult volunteerResult = new VolunteerResult();

            volunteerResult.result = true;
            volunteerResult.messages = new string[1];
            volunteerResult.messages[0] = json;
            volunteerResult.volunteerData = volunteer;
            return volunteerResult;
        }
    }

    public partial class Result
    {
        private string[] messagesField;

        private System.Nullable<bool> resultField;

        private bool resultFieldSpecified;
        [System.Xml.Serialization.XmlElementAttribute(IsNullable = true)]
        public string[] messages
        {
            get { return this.messagesField; }
            set { this.messagesField = value; }
        }

        [System.Xml.Serialization.XmlElementAttribute(IsNullable = true)]
        public System.Nullable<bool> result
        {
            get { return this.resultField; }
            set { this.resultField = value; }
        }

        [System.Xml.Serialization.XmlIgnoreAttribute()]
        public bool resultSpecified
        {
            get { return this.resultFieldSpecified; }
            set { this.resultFieldSpecified = value; }
        }
    }

    public partial class VolunteerResult : Result
    {
        public VolunteersNS.Volunteer volunteerData;
    }
}
