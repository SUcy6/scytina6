// To compile: clang++ -std=c++17 main.cpp -o main
// To run: ./main
#include <iostream>
#include <cmath>
#include <string>
#include <fstream>
#include <cstring>
int WIDTH(320), HEIGHT(320); // canvas width and height
struct Vec2{ // vector (x, y)
    int x, y;
    Vec2(){x = y = 0;}
    Vec2(int xx, int yy): x{xx},y{yy} {}
    Vec2 operator+(const Vec2& a) const{ return Vec2(this->x + a.x, this->y + a.y); } 
    Vec2 operator-(const Vec2& a) const{ return Vec2(this->x - a.x, this->y - a.y); }
    Vec2 operator*(const float& a) const{ return Vec2(this->x * a, this->y * a); }
};
struct Color{ // color structure (r, g, b)
    int r,g,b;
    Color(){this->r = 0; this->g = 0; this->b = 0;}
};
// set pixel values
void SetPixelColor(int x, int y, Color c, unsigned char* m_pixelData){
    m_pixelData[((y*WIDTH+x)*3)] = c.r;
    m_pixelData[((y*WIDTH+x)*3)+1] = c.g;
    m_pixelData[((y*WIDTH+x)*3)+2] = c.b;
}
// Draw a triangle
void DrawTriangle(Vec2 v0, Vec2 v1, Vec2 v2, unsigned char* image, Color c){
    // Barycentric Algorithm
    int maxX = std::max(v0.x, std::max(v1.x, v2.x));
    int minX = std::min(v0.x, std::min(v1.x, v2.x));
    int maxY = std::max(v0.y, std::max(v1.y, v2.y));
    int minY = std::min(v0.y, std::min(v1.y, v2.y));  

    Vec2 vt1 = Vec2(v1.x - v0.x, v1.y - v0.y);
    Vec2 vt2 = Vec2(v2.x - v0.x, v2.y - v0.y);

    for (int x = minX; x <= maxX; x++) {
        for (int y = minY; y <= maxY; y++) {
            Vec2 q = Vec2(x - v0.x, y - v0.y);
            float w1 = (float) (q.y * vt2.x - q.x * vt2.y) / (vt1.y * vt2.x - vt1.x * vt2.y); 
            float w2 = (float) (vt1.y * q.x - vt1.x * q.y) / (vt1.y * vt2.x - vt1.x * vt2.y);
            if ((w1 >= 0) && (w2 >= 0) && (w1 + w2 <= 1)) SetPixelColor(x, y, c, image);
        }
    }
}
// output ppm
void OutputImage(std::string fileName, unsigned char* m_pixelData){
   std::ofstream myFile(fileName.c_str());
   if(myFile.is_open()){
        myFile << "P3" << "\n";
        myFile << "320 320" << "\n";
        myFile << "255" << "\n";       
        for(int i =0; i < WIDTH*HEIGHT*3; i++)
            myFile << (int)m_pixelData[i] <<  " " << "\n";
        myFile.close();
   }
}

int main(){
    unsigned char* m_pixelData = new unsigned char[WIDTH*HEIGHT*3];
    memset(m_pixelData, 0, WIDTH*HEIGHT*3);
    Color red, blue, green;
    red.r = 255; blue.b = 255; green.g = 255;
    // Data for triangles
    Vec2 tri1[3] = {Vec2(160,60),Vec2(150,10),Vec2(75,190)};
    Vec2 tri2[3] = {Vec2(250,150),Vec2(200,80),Vec2(240,80)};
    Vec2 tri3[3] = {Vec2(150,180),Vec2(180,140),Vec2(230,220)};
    // Draw triangles
    DrawTriangle(tri1[0],tri1[1],tri1[2],m_pixelData,red);
    DrawTriangle(tri2[0],tri2[1],tri2[2],m_pixelData,blue);
    DrawTriangle(tri3[0],tri3[1],tri3[2],m_pixelData,green);
    // Output the final image
    OutputImage("triangles.ppm", m_pixelData);
    delete[] m_pixelData;
    return 0;
}
