using System.Text;
using System.Text.Json;

namespace CloneTwiAPI.Services
{
    public class AzureTranslatorService
    {
        private readonly HttpClient _httpClient;
        private readonly string _key;
        private readonly string _endpoint;
        private readonly string _region;

        public AzureTranslatorService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _key = config["AzureTranslator:Key"]!;
            _endpoint = config["AzureTranslator:Endpoint"]!;
            _region = config["AzureTranslator:Region"]!;
        }

        public async Task<string?> TranslateTextAsync(string text, string from, string to)
        {
            var route = $"/translate?api-version=3.0&from={from}&to={to}";
            var url = _endpoint.TrimEnd('/') + route;

            var requestBody = new object[] { new { Text = text } };
            var requestContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            using var request = new HttpRequestMessage(HttpMethod.Post, url);
            request.Content = requestContent;
            request.Headers.Add("Ocp-Apim-Subscription-Key", _key);
            request.Headers.Add("Ocp-Apim-Subscription-Region", _region);

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
                return null;

            var jsonResponse = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(jsonResponse);

            var translation = doc.RootElement[0].GetProperty("translations")[0].GetProperty("text").GetString();
            return translation;
        }
    }
}
