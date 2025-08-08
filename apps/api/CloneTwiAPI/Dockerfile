FROM mcr.microsoft.com/dotnet/sdk:9.0 

WORKDIR /app

EXPOSE 5000

COPY . /app
RUN dotnet restore

ENTRYPOINT ["dotnet", "watch", "run",  "--urls", "http://*:5000"]